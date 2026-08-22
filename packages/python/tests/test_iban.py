import json
from pathlib import Path

import pytest

from bank_lint import validate_iban

VECTORS = json.loads(
    (Path(__file__).resolve().parents[3] / "test-vectors" / "iban.json").read_text()
)

@pytest.mark.parametrize("case", VECTORS, ids=[c["input"] for c in VECTORS])
def test_iban(case):
    assert validate_iban(case["input"]).valid is case["valid"]