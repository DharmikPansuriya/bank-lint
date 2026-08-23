# bank-lint

Validate bank and account details - IBAN, UK sort codes, and US routing numbers — in both JavaScript and Python.

**Status:**
early development. APIs may change.

## Packages

- `packages/js` — JavaScript / TypeScript
- `packages/python` — Python

## Releasing

Both packages are versioned in lockstep. Bump the version in **both**
`packages/js/package.json` and `packages/python/pyproject.toml` to the same
number, then publish each.

### npm (packages/js)

    cd packages/js
    npm run build              # compile src/ -> dist/
    npm publish --dry-run      # sanity-check files + version before it's permanent
    npm publish --access public   # prompts for your 2FA code

### PyPI (packages/python)

    cd packages/python
    rm -rf dist/ build/ src/*.egg-info   # clear old build artifacts
    python -m build                       # build wheel + sdist
    twine check dist/*                    # must say PASSED (checks README renders)
    twine upload dist/*                   # user: __token__, password: your pypi-... token

### Notes

- Versions are permanent on both registries — you cannot overwrite or reuse a
  version number. Always run the dry-run / `twine check` first.
- npm requires 2FA enabled on your account to publish.
- PyPI needs an API token (pypi.org → Account settings → API tokens).
- After publishing, verify from a clean environment (see `CONTRIBUTING.md`).

## License

MIT
