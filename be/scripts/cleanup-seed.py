#!/usr/bin/env python3
"""
Script để:
1. Xóa các sản phẩm không phải áo, quần, áo khoác
2. Thêm nhiều ảnh (3-5 ảnh) cho mỗi sản phẩm còn lại
"""

import re
import json

import os

# Đọc file seed.ts (từ thư mục be)
script_dir = os.path.dirname(os.path.abspath(__file__))
be_dir = os.path.dirname(script_dir)
seed_file = os.path.join(be_dir, 'src', 'utils', 'seed.ts')

with open(seed_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Tìm phần products array
products_start = content.find('const products = [')
if products_start == -1:
    print("Không tìm thấy products array")
    exit(1)

# Tìm phần kết thúc của products array
products_end = content.find(']', products_start + len('const products = ['))
if products_end == -1:
    print("Không tìm thấy kết thúc products array")
    exit(1)

# Lấy phần products
products_section = content[products_start:products_end + 1]

# Tách các sản phẩm (dựa trên pattern { ... },)
product_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
products = re.findall(product_pattern, products_section, re.DOTALL)

# Lọc sản phẩm chỉ giữ lại áo, quần, áo khoác
allowed_categories = ['ao', 'quan', 'ao-khoac']
filtered_products = []
removed_count = 0

for product in products:
    # Kiểm tra category_slug
    category_match = re.search(r"category_slug:\s*['\"]([^'\"]+)['\"]", product)
    if category_match:
        category = category_match.group(1)
        if category in allowed_categories:
            filtered_products.append(product)
        else:
            removed_count += 1
            # Tìm tên sản phẩm để log
            name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", product)
            name = name_match.group(1) if name_match else "Unknown"
            print(f"Xóa: {name} (category: {category})")
    else:
        # Nếu không tìm thấy category_slug, giữ lại (có thể là lỗi format)
        filtered_products.append(product)

print(f"\nĐã xóa {removed_count} sản phẩm")
print(f"Còn lại {len(filtered_products)} sản phẩm")

# Thêm nhiều ảnh cho mỗi sản phẩm
# Sử dụng các URL ảnh mẫu từ các sản phẩm hiện có
sample_images = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBoFyER9pdtDnuaC0PscjJSKfsUyEntOiNej1YkSDM4vBrl78GdLlpo7eaYzyNckVwkHXny9bgTnwEAaekW8GK8OVM_gbqMYK5011a6LiM02ksL6OJLwJc8_Hg33UpUrppxwT5tJbmjURSsZksQKlKvNdQJ4rKkUJaEE57-JzQw7vtFr0LWLsIhgcitjsi-P_dtHjYorVU1w2uMeDICutBJON1fpuFr63edw4YvaQ3-Vrj_j6PTJ2NxDYxBjdyi0ZfaxRIs1bvm-VY',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOuuoER_GQZsnHfUk3TCiQNOUhZqBxgCceAgnYNdoCbza2klQq7zMAY4bXnZ1wJghVG4c7x1X2WqZ5fHgjmMpkI0AJOYtMvO9pvF6CW1mJft9QDdQ-mE7ClxX4cLhVn-V_9RV3Ax-zcHH325v06q1y3oDQAOx-wnv8xDrZoyfjW8iB-QDioE-LYDzNJZr1aZangd2CZwABZFJQqJ31BwEaZU9i1BSWU0ehssQbK5uN5ZphkniB7k1b3y0Mei2K_05lBxcCgzms5g',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAcP1SM3mfwFBoquuBWoz__0nrOLtN8RxRjRAmigdnqdsePVEqi9MLO889mNylT7KhG6BEIdygbM_5YNXAGaessHG8MtULsFEhyp76VcXU_J6zyHRG9HmkFvjLI1rOdDL5OEFd0M5ANizVNRRZ5JLHgme61a84GtNjPSZdjX1R_NqbjQAVW_Bwv4RTde_lTR6MaFMplfEa0WRP_e7r8kJD06YMtc3_p_iCUCLznB7-apIoxPhpnPsfZKhCZ2uYqzaeD5H46Cvoq6Jc',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMqAqtNTQKSUSwn4wix2mVgoVRd0H24ZEL8mc-KahVYugPMwUyyO7acy5iv4EzQ-tvQ9OUyoMz8mnKcphyFVmXhpB2n8cUNNIHfTI9MysQheU-VIkaDS5U-Phv4-Z5sW6jNi5i8rYAgeqUqd0kbeW0PHieIBS6Y4E6p2grqtReh3Ck1wG3mR6KXZbqzgPF4rd1AwDEvnZD63roPHKp61vx0vu8PBDVH2gFx3hDuJlBuxMhkDT_iYDbq4wxnxhlxxC8umoelfUetA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAiwItxtH0JJmLvWVXoODE6wkscbDzatT8b7Il1L-9P1I_JN9BrXw07qzumYONf9AaFPf-aIm_XKp6HhXRDc1XhH3h4p6FVwyTZawOIDiQpz-PR82_h6U3lKf_yyrDMVVNhK1clksKb9njYud52BSQIR7lL4juvVL5fRJGYlU76AxEdTFXOUrCRPHjsRY0hrXLYqVmp6msDdop_Y2P0onTTa7s3mpbyyNgyKJvEw_FnFWz2NidUhik3odMMaRWkB1dsP9bH0CC6o6I',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAIp8PONZrBzQJOTWmY-NR225RYmAOK5k-NuTw1DkF9YflRcECoy9QTLF9tDWsbKuO0M6dn3f6kkCG8x3Eg9Z_AkYbSIFWHVMQJ9I88yE1Qx65IzrOt6NPEKNY0tmXrZ77e5tOydYA-UNib7qGTtgTWAv-kkXdauSKorOGVUInTQfqXHXueB5YuwLoFzIZMPUdoz2ckNdZvRYa3ek-zlmZX-mCoJQF2Q13sCey7qXtLm7C6A3jDPRB5MwVpyLdfcrHAd2O11jfgkA8',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAWL-oSxkESnYddTPSI30h7FSi_hGVoCfejRb998N167y00XgTQ8F9zrfQQeoLKYYya0phCvlTpXOEoyzRljEtrlZuLheT4ITOEUJH9dQxccspAGrbyiRS880grxdQ4XIvsuvitm5oJJoq-Nbs1icBH2S8DO1wM4f_utAZmw_EuhUdi_ly3P2WC4nqJNgueDCNme6JwQE7G6gwWECYvG5mJOwkDVbU-S7i5NJnO2-Ttl6uYeHrkPA3zGyzmLXqkUcP60JBrfzRxfTQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD7JM5MXmHHhs4l1bezu6ioxRC_B7HmXIjc6zpvwqyAE4qSpEZkNistyVZ206sktIYNFrnVLgq_9VNBtRo9-C9wHAhX3_mREIzHXB1HZT8y0o_awsQeuphTC-tdPojndXAAg-7kkYhUNlZQk5gV9xOtJqLUNAQPr9aTvZpA2wzf0LbnH3IY5Ci_ug0ai9sziZngm-XTj8v9SDUvg91FvvsUVC42HCj55AsThEM3C_XfHatVVUBpBRRdTSuvJuMxKPnH5u30_9bu514',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBkPLHK_HNG4jCTkVYqsVwfjJoCL8-UvRUo5hAqFf94fMAcyvVtoottzeQFlNn485V6UNWtIxbZSx4kDQnpbKm11jqjWA5fxYiAWqMF42ZGjQX5H8aCer6BoT-wPfrai2pJlNJiRIx9ZMsmVh5jFgwxlTLb-tEuh0RwJtjt_N7JgWvc8PYeShbCwNxMFcEr9t08LojGLBlPe_6vXxyPZkF4hpIwWH50TLMAkwG2ICx60yvRkmS3KsjnUHEjgQT0kvTaJy2JY7M_4A4'
]

import random

updated_products = []
for product in filtered_products:
    # Tìm images array và thay thế
    # Pattern: images: [ ... ]
    images_pattern = r"images:\s*\[[^\]]*\]"
    
    # Lấy ảnh đầu tiên từ product (nếu có)
    image_match = re.search(r"image:\s*['\"]([^'\"]+)['\"]", product)
    first_image = image_match.group(1) if image_match else sample_images[0]
    
    # Chọn 3-5 ảnh ngẫu nhiên (bao gồm ảnh đầu tiên)
    num_images = random.randint(3, 5)
    selected_images = [first_image] + random.sample(sample_images, num_images - 1)
    
    # Tạo images array mới
    images_array = "images: [\n      " + ",\n      ".join([f"'{img}'" for img in selected_images]) + "\n    ]"
    
    # Thay thế images array cũ
    updated_product = re.sub(images_pattern, images_array, product, flags=re.DOTALL)
    updated_products.append(updated_product)

# Tạo lại products section
new_products_section = "const products = [\n  " + ",\n  ".join(updated_products) + "\n]"

# Thay thế trong content
new_content = content[:products_start] + new_products_section + content[products_end + 1:]

# Ghi lại file
with open(seed_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\n✅ Đã cập nhật file seed.ts")
print(f"   - Xóa {removed_count} sản phẩm không phải áo/quần/áo khoác")
print(f"   - Còn lại {len(updated_products)} sản phẩm")
print(f"   - Mỗi sản phẩm có 3-5 ảnh")

