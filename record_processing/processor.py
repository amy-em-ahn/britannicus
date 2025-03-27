import json
import csv
from collections import defaultdict

def convert_iso_to_datetime(iso_str):
    """Convert ISO 8601 format to datetime string without timezone"""
    if not iso_str:
        return ''
    return iso_str.split('.')[0].replace('T', ' ')

def format_genre(genre_str):
    """Convert genre string to PostgreSQL text array format"""
    if not genre_str:
        return ''
    return '{' + genre_str + '}'

# Load data from input file
with open('products.json', 'r') as f:
    data = json.load(f)

products = data['products']

# Initialize counters and data storage
counter = defaultdict(int)
output_data = {
    'product': [],
    'book': [],
    'map': [],
    'periodical': []
}

# Process each product
for product_id, product in products.items():
    # Common product data
    counter['product'] += 1
    product_row = {
        'id': counter['product'],
        'title': product.get('title', ''),
        'price': product.get('price', ''),
        'currency': product.get('currency', ''),
        'seller': product.get('seller', ''),
        'location': product.get('location', ''),
        'description': product.get('description', ''),
        'imageUrl': product.get('image', ''),
        'salesOptions': product.get('options', ''),
        'publishedDate': convert_iso_to_datetime(product.get('createdAt')),
        'publisher': product.get('publishedby', ''),
        'stock': product.get('stock', ''),
        'condition': product.get('condition', ''),
        'uuid': product.get('id', '')
    }
    output_data['product'].append(product_row)

    # Handle category-specific data
    category = product.get('category', '')
    
    if category in ['rare-books', 'first-editions']:
        counter['book'] += 1
        book_row = {
            'id': counter['book'],
            'productId': counter['product'],
            'author': product.get('author', ''),
            'genre': format_genre(product.get('genre', '')),
            'isbn': product.get('isbn', ''),
            'language': product.get('language', ''),
            'format': product.get('format', ''),
            'spectCategory': product.get('category', '')
        }
        output_data['book'].append(book_row)
    elif category == 'maps':
        counter['map'] += 1
        map_row = {
            'id': counter['map'],
            'productId': counter['product'],
            'projection': '',  # Not present in source data
            'dimensions': product.get('size', ''),
            'scale': '',       # Not present in source data
            'detail': '',      # Not present in source data
            'isDiscontinued': ''  # Not present in source data
        }
        output_data['map'].append(map_row)
    elif category == 'periodicals':
        counter['periodical'] += 1
        periodical_row = {
            'id': counter['periodical'],
            'productId': counter['product'],
            'edition': product.get('edition', ''),
            'volume': product.get('volume', ''),
            'genre': format_genre(product.get('genre', '')),
            'isbn': product.get('isbn', ''),
            'language': product.get('language', '')
        }
        output_data['periodical'].append(periodical_row)

# Write CSV files
for table_name, rows in output_data.items():
    if not rows:  # Skip empty tables
        continue
        
    with open(f'{table_name}.csv', 'w', newline='') as csvfile:
        fieldnames = rows[0].keys() if rows else []
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

print("CSV files generated successfully!")
print(f"Products: {counter['product']}")
print(f"Books: {counter['book']}")
print(f"Maps: {counter['map']}")
print(f"Periodicals: {counter['periodical']}")