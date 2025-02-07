import os
import re

# Set your project directory here
PROJECT_DIR = "./pages/"

# Output file for the list of changes
OUTPUT_FILE = "change-these-lines.txt"

# Regex to find hardcoded strings
HARD_CODED_STRING_REGEX = r"['\"]([^'\"]+)['\"]"

# Exclusions (to avoid including strings inside `t('...')`)
EXCLUSION_REGEX = r"t\(['\"]([^'\"]+)['\"]\)"

# Process file and list hardcoded strings
def process_file(file_path, output_lines):
    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    for line_number, line in enumerate(lines, start=1):
        matches = re.finditer(HARD_CODED_STRING_REGEX, line)
        for match in matches:
            # Skip if the string is already inside `t(...)`
            if not re.search(EXCLUSION_REGEX, line):
                hardcoded_string = match.group(0)  # Get the matched string including quotes
                output_lines.append(f"{file_path}:{line_number}: {line.strip()} -> {hardcoded_string}")

# Process all files in the project
def process_project(directory):
    output_lines = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith((".js", ".jsx", ".ts", ".tsx")):
                file_path = os.path.join(root, file)
                process_file(file_path, output_lines)

    # Write results to the output file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as output_file:
        output_file.write("\n".join(output_lines))

    print(f"Found {len(output_lines)} hardcoded strings. See '{OUTPUT_FILE}' for details.")

if __name__ == "__main__":
    process_project(PROJECT_DIR)
