#insert new video


curl -L -X POST 'https://basked urlt' \
  -H 'Content-Type: application/json' \
  --data '{
  "index_no": "230312J",
  "student_name": "Unknown",
  "module_code": "EE2094",
  "title": "Day 01 (Resonance and Filters)",
  "youtube_links": ["https://drive.google.com/file/d/..."],
  "telegram_links": ["https://t.me/..."],
  "material_urls": [],
  "is_kuppi": true,
  "description": "RLC resonance, Filters, Low-pass, High-pass, Band-pass, Band-stop, Signal shaping.",
  "language_code": "si",
  "published_at": "2025-04-25"
}'
 

 {"success":true,"video":[{"id":19,"module_id":31,"title":"Day 01 (Resonance and Filters)","youtube_links":["https://drive.google.com/file/d/..."],"telegram_links":["https://t.me/..."],"material_urls":[],"is_kuppi":true,"student_id":6,"created_at":"2025-09-06T06:29:38.592309","description":"RLC resonance, Filters, Low-pass, High-pass, Band-pass, Band-stop, Signal shaping.","language_code":"si","published_at":"2025-04-25"}]}⏎


 # insert student data

 curl -L -X POST 'https://b_data' \
            -H 'Content-Type: application/json' \
            --data '{
        "index_no": "230312J",
        "name": "Teshan Kannangara",
        "faculty": "Engineering",
        "batch": 2023,
        "image_url": "https://eczksamd.sds.s",
        "linkedin_url": "https://dds.sd"
      }'

{"success":true,"student":{"id":6,"name":"Teshan Kannangara","faculty_id":1,"department_id":2,"batch_id":4,"semester_id":1,"image_url":"https://eczksamd.sds.s","linkedin_url":"https://dds.sd","index_no":"230312J"}}⏎           

