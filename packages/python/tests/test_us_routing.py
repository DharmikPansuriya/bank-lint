import json
from pathlib import Path

import pytest

from bank_lint import validate_us_routing

VECTORS = json.loads(
    (Path(__file__).resolve().parents[3] / "test-vectors" / "us-routing.json").read_text()
)


@pytest.mark.parametrize("case", VECTORS, ids=[repr(c["input"]) for c in VECTORS])
def test_us_routing(case):
    result = validate_us_routing(case["input"])
    assert result.valid is case["valid"]
    if case.get("error"):
        assert result.error == case["error"]
    elif case["valid"]:
        assert result.error is None
