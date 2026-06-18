# قاعدة البيانات المحلية (PGlite) — لماذا تختفي الدروس؟

## السبب

التطبيق يستخدم مجلد واحد: `.data/flashcards`

إذا فُتح من **برنامجين معاً** (مثلاً `pnpm dev` + `node scripts/...`) يتلف الملف ويظهر خطأ `Aborted()`.

عندها كان السيرفر **يمسح المجلد بالكامل** ويعيد إنشاء قاعدة فارغة + درس Daniel فقط من البذرة → **يختفي الدرس الثاني** ومعظم الصور.

**إصلاح إضافي:** كان هناك قيد «كلمة إنجليزية واحدة في كل التطبيق» (مثل `mystery` في Daniel والدرس الثاني معاً) فكان `db:restore-all` يفشل عند الدرس الثاني. تم استبداله بقيد **لكل درس على حدة**.

السيرفر يضع ملف قفل `.api-server.lock` — السكربتات ترفض العمل إذا كان `pnpm dev` شغالاً.

## القواعد (مهم)

1. **أوقف `pnpm dev` قبل أي سكربت صور أو استعادة**
2. **لا تعدّل** دروس المنهج الستة (grade 1–5 + Miscellaneous Words) إلا بعد موافقة المستخدم في المحادثة (نعم)
3. بعد أي تلف: `pnpm run db:restore-all` (مع `GRADE123_DB_WRITE_CONFIRMED=1` لاستعادة الصفوف والمنوعة)
4. ثم `pnpm run dev` وحدّث المتصفح Ctrl+Shift+R

## دروس محمية (مجمّدة)

| الدرس | الكروت |
|--------|--------|
| grade 1 | 300 |
| grade 2 | 600 |
| grade 3 | 800 |
| grade 4 | 1000 |
| grade 5 | 1500 |
| Miscellaneous Words | 195 |

## أوامر مفيدة

| الأمر | متى |
|--------|-----|
| `pnpm run db:restore-all` | بعد اختفاء درس أو صور |
| `pnpm run db:audit-curriculum` | فحص سلامة الدروس الستة (قراءة فقط) |
| `pnpm run db:snapshot-curriculum` | حفظ لقطة مرجعية في `.data/curriculum-snapshot.json` |
| `pnpm run db:restore-daniel` | صور Daniel من مجلد assets |
| `pnpm run db:restore-misc` | درس Miscellaneous Part 1 (مصدر مخفي) |
| `pnpm run images:daniel-redo` | توليد 51 صورة (السيرفر متوقف) |

النسخ الاحتياطي التلقائي (إن حدث مسح): `.data/backups/`
