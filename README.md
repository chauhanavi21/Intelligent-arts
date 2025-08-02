
---

## 🌐 Pages Implemented

| Page     | Path         | Description                                  |
|----------|--------------|----------------------------------------------|
| Home     | `/`          | Hero carousel + top 8 books list             |
| Books    | `/books`     | All 16 books rendered with same design       |
| Profile  | `/profile/:id` | Dynamic routing (currently static dummy)     |
| Archives | `/archives`  | Placeholder page                             |
| Contact  | `/contact`   | Placeholder page                             |

---

## 📚 Features

- ✅ Fully responsive layout
- ✅ Hero section carousel (Swiper.js) with 10s autoplay
- ✅ Custom font: **Lato**
- ✅ Book cards loaded from `books.json`
- ✅ "Read more" linking to `/profile/:id`
- ✅ View All Books → `/books` page
- ✅ Logo + Navbar links scroll to top even if on same page

---

## ⚙️ Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
