# Movie Search App 🎬

تطبيق للبحث عن الأفلام يعرض الأفلام الشائعة والأكثر بحثاً، ويتيح تصفح الأفلام حسب التصنيف وعرض تفاصيل أي فيلم، باستخدام React و TMDB API و Appwrite.

🔗 **النسخة المنشورة:** https://majed-movie-app.netlify.app

## ✨ المميزات (Features)

* البحث عن الأفلام مع **Debounce** لتقليل عدد الطلبات، وإلغاء الطلبات القديمة تلقائياً.
* عرض **الأفلام الأكثر بحثاً** (Trending) المحفوظة في Appwrite.
* **فلتر التصنيفات** (أكشن، كوميديا، ...) من TMDB.
* زر **Load More** لتحميل المزيد من الأفلام صفحة بعد صفحة.
* **نافذة تفاصيل** الفيلم: القصة، التقييم، المدة، التصنيفات.
* تصميم متجاوب مع الجوال باستخدام Tailwind CSS.

## 🚀 التقنيات المستخدمة (Tech Stack)

* **React** + **Vite**
* **Tailwind CSS**
* **TMDB API** (بيانات الأفلام والتقييمات)
* **Appwrite** (قاعدة بيانات لحفظ عداد البحث والأفلام الأكثر بحثاً)
* **Netlify** (النشر التلقائي من فرع `main`)

## 🛠️ التشغيل المحلي (Setup & Installation)

1. استنسخ المستودع:

   ```bash
   git clone https://github.com/majed-edu/movie-app.git
   cd movie-app
   ```

2. ثبّت الحزم:

   ```bash
   npm install
   ```

3. أنشئ ملف `.env.local` في جذر المشروع وأضف المتغيرات التالية:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_read_access_token
   VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
   VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
   ```

   > **ملاحظة:** المتغير `VITE_TMDB_API_KEY` يجب أن يكون **API Read Access Token** من حسابك في TMDB (الطويل الذي يبدأ بـ `eyJ`)، وليس مفتاح API القصير.

4. شغّل خادم التطوير:

   ```bash
   npm run dev
   ```

## 🗄️ إعداد Appwrite

أنشئ Collection في قاعدة بياناتك تحتوي على الحقول التالية:

| الحقل        | النوع   |
| ------------ | ------- |
| `searchTerm` | String  |
| `count`      | Integer |
| `movie_id`   | Integer |
| `poster_url` | String  |

## 📦 البناء والنشر (Build & Deploy)

```bash
npm run build

```

يُنتج البناء مجلد `dist/`. المشروع منشور على Netlify ومربوط بفرع `main`، وأي `push` إلى هذا الفرع يبدأ عملية نشر تلقائية. تُضاف متغيرات البيئة نفسها في إعدادات Netlify (Site configuration → Environment variables).

## 📁 هيكل المشروع

```
src/
├── App.jsx                 # الحالة الرئيسية وجلب البيانات
├── appwrite.js             # الاتصال بـ Appwrite (Trending + عداد البحث)
├── tmdb.js                 # إعدادات TMDB المشتركة
└── components/
    ├── Search.jsx          # خانة البحث
    ├── MovieCard.jsx       # بطاقة الفيلم
    ├── MovieModal.jsx      # نافذة تفاصيل الفيلم
    ├── GenreFilter.jsx     # فلتر التصنيفات
    └── Spinner.jsx         # مؤشر التحميل
```

## 🔒  الأمان

ملفات `.env` و `.env.local` مضافة إلى `.gitignore` ولا تُرفع إلى GitHub. متغيرات Vite التي تبدأ بـ `VITE_` تُضمَّن في كود المتصفح، لذلك لا تضع فيها أسراراً حساسة.