#!/bin/bash
set -e

# Clear previous coverage.
rm -rf coverage

# Generate test coverage
# npm run ava

# Move generated JSON file so it can be remapped and won't confuse Istanbul
# later.

# Generate an lcov.info file and an HTML report, and output a text report.
# istanbul report lcov text
istanbul cover --report=json ava
# mv coverage/coverage-final.json coverage/coverage.json
# istanbul report lcov text
