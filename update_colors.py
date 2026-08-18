import os
import re

directory = r'd:\fitsync-ai\src'
hex_colors = ['#E8734A', '#9B8CF0', '#2BB893', '#4A9FE8', '#F2679B', '#06b6d4']

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    # Replace arbitrary tailwind classes like bg-[#E8734A] -> bg-accent
    for color in hex_colors:
        content = re.sub(r'bg-\[' + color + r'\]', 'bg-accent', content, flags=re.IGNORECASE)
        content = re.sub(r'text-\[' + color + r'\]', 'text-accent', content, flags=re.IGNORECASE)
        content = re.sub(r'border-\[' + color + r'\]', 'border-accent', content, flags=re.IGNORECASE)
        
        # also handle /opacity like bg-[#E8734A]/10 -> bg-accent/10
        content = re.sub(r'bg-\[' + color + r'\]/(\d+)', r'bg-accent/\1', content, flags=re.IGNORECASE)
        content = re.sub(r'text-\[' + color + r'\]/(\d+)', r'text-accent/\1', content, flags=re.IGNORECASE)
        content = re.sub(r'border-\[' + color + r'\]/(\d+)', r'border-accent/\1', content, flags=re.IGNORECASE)

        # Handle JS string literals like '#E8734A' -> 'var(--accent)'
        content = re.sub(r'[\'\"]' + color + r'[\'\"]', "'var(--accent)'", content, flags=re.IGNORECASE)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css')):
            process_file(os.path.join(root, file))
