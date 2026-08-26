#!/usr/bin/env bash
# Publish bank-lint to npm and PyPI.
# Reads NPM_TOKEN and PYPI_TOKEN from the environment or a root .env file.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

js_ver="$(node -p "require('$ROOT/packages/js/package.json').version")"
py_ver="$(sed -n 's/^version = "\(.*\)"/\1/p' "$ROOT/packages/python/pyproject.toml" | head -n 1)"

if [[ "$js_ver" != "$py_ver" ]]; then
  echo "Version mismatch: js=$js_ver python=$py_ver" >&2
  exit 1
fi

if [[ -z "${NPM_TOKEN:-}" ]]; then
  echo "NPM_TOKEN is not set. Add it to .env or export it." >&2
  exit 1
fi
if [[ -z "${PYPI_TOKEN:-}" ]]; then
  echo "PYPI_TOKEN is not set. Add it to .env or export it." >&2
  exit 1
fi
if [[ "${PYPI_TOKEN}" != pypi-* ]]; then
  echo "PYPI_TOKEN should start with pypi-" >&2
  exit 1
fi

echo "Publishing bank-lint@$js_ver"

cleanup() {
  if [[ -n "${NPMRC_TMP:-}" && -f "${NPMRC_TMP}" ]]; then
    rm -f "${NPMRC_TMP}"
  fi
}
trap cleanup EXIT

NPMRC_TMP="$(mktemp)"
chmod 600 "${NPMRC_TMP}"
printf '//registry.npmjs.org/:_authToken=%s\n' "${NPM_TOKEN}" > "${NPMRC_TMP}"
export NPM_CONFIG_USERCONFIG="${NPMRC_TMP}"

echo "==> npm"
cd "$ROOT/packages/js"
npm test
npm run build
if npm view "bank-lint@${js_ver}" version >/dev/null 2>&1; then
  echo "npm already has ${js_ver}, skipping"
else
  printf 'y\ny\n' | npm publish --access public --yes
fi

echo "==> PyPI"
cd "$ROOT/packages/python"
PYTHON="$ROOT/packages/python/.venv/bin/python"
if [[ ! -x "$PYTHON" ]]; then
  PYTHON="python3"
fi
"$PYTHON" -m pytest
rm -rf dist build
"$PYTHON" -m build
"$PYTHON" -m twine check dist/*
export TWINE_USERNAME="__token__"
export TWINE_PASSWORD="${PYPI_TOKEN}"
printf 'y\ny\n' | "$PYTHON" -m twine upload --non-interactive --skip-existing dist/*

echo "Published bank-lint@$js_ver"
echo "  npm  https://www.npmjs.com/package/bank-lint"
echo "  PyPI https://pypi.org/project/bank-lint/"
