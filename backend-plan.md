# خطة تطوير الواجهة الخلفية (Backend Plan)

تعتمد بنية الواجهة الخلفية على قاعدة بيانات علائقية (PostgreSQL) مصممة لتكون متوافقة بشكل كامل مع منصات مثل Supabase، مما يتيح الاستفادة من ميزات الوقت الفعلي (Realtime) والمصادقة (Authentication). تم تقسيم قاعدة البيانات إلى أقسام لضمان التنظيم العالي.

## 1. هيكل قاعدة البيانات (Database Schema)

- **الملف الأساسي (`01_core_schema.sql`)**: يحتوي على الجداول المشتركة والأساسية مثل: المستخدمين (users)، السائقين (drivers)، الاشتراكات العامة (subscriptions)، الرحلات (trips)، الإشعارات (notifications)، الفواتير (invoices)، والشكاوى (complaints).
- **ملف أولياء الأمور (`02_parent_schema.sql`)**: يحتوي على جداول الطلاب (students)، وتفاصيل اشتراكات أولياء الأمور (parent_subscriptions)، وجدول تسجيل غياب الطلاب (student_absences).
- **ملف الموظفين (`03_employee_schema.sql`)**: يحتوي على الملف التعريفي للموظفين (employee_profiles) لتخزين جهات العمل، وجدول تسجيل غياب الموظف الفردي (employee_absences).
- **ملف المؤسسات (`04_institution_schema.sql`)**: يحتوي على ملف المؤسسة (institution_profiles)، قائمة العمال التابعين للمؤسسة (workers)، تفاصيل اشتراك المؤسسة (institution_subscriptions)، جدول لربط العمال بالاشتراك (subscription_workers)، وجدول لتسجيل غياب العمال (worker_absences).

## 2. دوال ومشغلات قاعدة البيانات (Database Triggers & Functions)
هذه الدوال تعمل تلقائياً في الخلفية على مستوى قاعدة البيانات:
- `notify_parent_on_board()`: مشغل (Trigger) يقوم بإرسال إشعار تلقائي لولي الأمر بمجرد تغيير حالة الرحلة إلى "ركب الباص" (boarded).
- `check_employee_profile()`: دالة تتحقق من أن المستخدم الذي يتم إضافته لجدول الموظفين يملك صلاحية (account_type = 'employee').
- `check_subscription_worker_limit()`: دالة تمنع إضافة عدد من العمال يفوق الحد المسموح به (`individuals_count`) في اشتراك المؤسسة.

## 3. واجهات برمجة التطبيقات (API/RPC Functions) المطلوبة للواجهة الأمامية
لتسهيل عمل فريق الواجهة الأمامية، يجب توفير الدوال التالية (End Points أو Supabase RPCs) للنداء عليها:

- **`create_subscription(payload)`**: إنشاء اشتراك جديد وتوزيع البيانات على الجداول المرتبطة حسب نوع الحساب (parent, employee, institution).
- **`mark_trip_absent(trip_id, target_ids[])`**: تسجيل غياب مستخدم (أو مجموعة عمال للمؤسسة) عن رحلة معينة وإضافتهم لجداول الغياب المخصصة حسب النوع.
- **`undo_trip_absent(trip_id, target_ids[])`**: التراجع عن الغياب وحذف السجلات من جداول الغياب.
- **`update_trip_status(trip_id, new_status)`**: تحديث حالة الرحلة (يستخدم بواسطة السائق).
- **`get_institution_stats(institution_id)`**: استرجاع بيانات لوحة التحكم للمؤسسة مجمعة (إجمالي العمال، الرحلات النشطة، معدل الغياب).
- **`swap_subscription_worker(subscription_id, old_worker_id, new_worker_id)`**: لتبديل عامل بعامل آخر داخل اشتراك المؤسسة وتحديث جدول `subscription_workers`.
- **`get_live_trip_updates(user_id)`**: دالة استماع (Realtime Subscription) لمتابعة التحديثات الحية لموقع الباص وحالة الرحلة.
