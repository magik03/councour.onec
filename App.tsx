
import React, { useState, useEffect } from 'react';

// Added missing interface definitions to make the file self-contained since types.ts is deprecated.
interface Semester {
  s1: string;
  s2: string;
  annual: string;
}

interface FormData {
  directorate: string;
  requestedRank: string;
  teachingSubject: string;
  nin: string;
  lastNameAr: string;
  firstNameAr: string;
  lastNameLat: string;
  firstNameLat: string;
  fatherName: string;
  motherFirstName: string;
  motherLastName: string;
  birthDate: string;
  birthPlace: string;
  birthState: string;
  birthOriginalState: string;
  gender: string;
  maritalStatus: string;
  childrenCount: string;
  fullAddress: string;
  residenceCommune: string;
  phoneNumber: string;
  militaryStatus: string;
  docRefNum: string;
  docIssueDate: string;
  docEndDate: string;
  serviceStartDate: string;
  serviceEndDate: string;
  degreeName: string;
  specialty: string;
  degreeNum: string;
  graduationDate: string;
  issuingInstitution: string;
  trainingDuration: string;
  startYear: string;
  endYear: string;
  degreeGrade: string;
  isEnsaGraduate: boolean;
  isFirstInClass: boolean;
  firstInClassDocNum: string;
  firstInClassDocDate: string;
  firstInClassIssuer: string;
  gpa: string;
  thesisGrade: string;
  semesters: Semester[];
  otherDegreeName: string;
  otherDegreeSpecialty: string;
  otherDegreeIssuer: string;
  otherDegreeSemesters: string;
  otherDegreeFromYear: string;
  otherDegreeToYear: string;
  publicationType: string;
  publicationDate: string;
  journalName: string;
  journalIssue: string;
  publicationLink: string;
  expType: string;
  expJob: string;
  expInstitution: string;
  expApprovedDegree: string;
  expContractNum: string;
  expContractDate: string;
  expFrom: string;
  expTo: string;
  expEndReason: string;
  isEmployed: boolean;
  currentRank: string;
  firstAppointmentDate: string;
  rankAppointmentDate: string;
  currentGrade: string;
  adminRefNum: string;
  adminRefDate: string;
  signingAuthority: string;
  adminPhone: string;
  adminAddress: string;
  email: string;
  attachedDocs: string[];
}

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    directorate: '', requestedRank: '', teachingSubject: '',
    nin: '', lastNameAr: '', firstNameAr: '', lastNameLat: '', firstNameLat: '',
    fatherName: '', motherFirstName: '', motherLastName: '', birthDate: '',
    birthPlace: '', birthState: '', birthOriginalState: '', gender: '',
    maritalStatus: '', childrenCount: '', fullAddress: '', residenceCommune: '',
    phoneNumber: '',
    militaryStatus: '', docRefNum: '', docIssueDate: '', docEndDate: '',
    serviceStartDate: '', serviceEndDate: '',
    degreeName: '', specialty: '', degreeNum: '', graduationDate: '',
    issuingInstitution: '', trainingDuration: '', startYear: '', endYear: '',
    degreeGrade: '', isEnsaGraduate: false, isFirstInClass: false,
    firstInClassDocNum: '', firstInClassDocDate: '', firstInClassIssuer: '',
    gpa: '', thesisGrade: '',
    semesters: Array(5).fill(null).map(() => ({ s1: '', s2: '', annual: '' })),
    otherDegreeName: '', otherDegreeSpecialty: '', otherDegreeIssuer: '',
    otherDegreeSemesters: '', otherDegreeFromYear: '', otherDegreeToYear: '',
    publicationType: '', publicationDate: '', journalName: '', journalIssue: '',
    publicationLink: '',
    expType: '', expJob: '', expInstitution: '', expApprovedDegree: '',
    expContractNum: '', expContractDate: '', expFrom: '', expTo: '', expEndReason: '',
    isEmployed: false, currentRank: '', firstAppointmentDate: '',
    rankAppointmentDate: '', currentGrade: '', adminRefNum: '',
    adminRefDate: '', signingAuthority: '', adminPhone: '', adminAddress: '',
    email: '', attachedDocs: []
  });

  const experienceOptions = [
    "1. خبرة مهنية في قطاع التربية الوطنية (ممضاة من مدير التربية).",
    "2. خبرة مهنية في إدارة عمومية أخرى تضمن مهام التدريس.",
    "3. خبرة مهنية في المؤسسات التابعة لقطاع التربية الوطنية في منصب مختلف.",
    "4. خبرة مهنية في الإدارات العمومية الأخرى تضمن مهام التدريس في منصب مختلف.",
    "5. خبرة مهنية مثبتة قانونًا في المؤسسات الخاصة للتربية والتعليم."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSemesterChange = (index: number, field: 's1' | 's2' | 'annual', value: string) => {
    const newSemesters = [...formData.semesters];
    newSemesters[index] = { ...newSemesters[index], [field]: value };
    setFormData(prev => ({ ...prev, semesters: newSemesters }));
  };

  const handleDocToggle = (doc: string) => {
    setFormData(prev => {
      const isSelected = prev.attachedDocs.includes(doc);
      const docs = isSelected
        ? prev.attachedDocs.filter(d => d !== doc)
        : [...prev.attachedDocs, doc];
      
      // If the toggled document is one of the experience options, update expType automatically
      let newExpType = prev.expType;
      if (experienceOptions.includes(doc)) {
        if (!isSelected) {
          // If selecting, make this the active exp type
          newExpType = doc;
        } else if (prev.expType === doc) {
          // If deselecting the current active one, find another selected exp or empty it
          const remainingExps = docs.filter(d => experienceOptions.includes(d));
          newExpType = remainingExps.length > 0 ? remainingExps[0] : '';
        }
      }

      return { ...prev, attachedDocs: docs, expType: newExpType };
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/ksarinfo.impr@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          _subject: `طلب مشاركة جديد: ${formData.firstNameAr} ${formData.lastNameAr}`,
          _template: "table"
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال بالخادم.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-t-8 border-green-500">
          <svg className="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-black text-gray-800 mb-2">تم الإرسال بنجاح!</h1>
          <p className="text-gray-600 mb-6">لقد استلمنا طلبكم بنجاح. سيتم مراجعة المعلومات والتواصل معكم قريباً عبر البريد الإلكتروني.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-700 transition"
          >
            تقديم طلب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 md:px-0">
      <header className="mb-10 text-center bg-white border-2 border-black p-6 rounded-sm shadow-sm">
        <h1 className="text-3xl font-black mb-2">استمارة المعلومات</h1>
        <p className="text-xl font-bold text-gray-700">(للمشاركة في المسابقة على أساس الشهادة)</p>
        <div className="mt-4 inline-block px-4 py-1 border-2 border-gray-400 font-bold text-lg">
          د. عبد المجيد
        </div>
      </header>

      <div className="mb-6 flex items-center justify-between text-sm font-bold text-gray-500 overflow-x-auto gap-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`flex-1 text-center pb-2 border-b-4 ${step >= s ? 'border-gray-800 text-gray-800' : 'border-gray-200'}`}>
            المرحلة {s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="form-section">
              <h2 className="section-header">1. معلومات الوظيفة المطلوبة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-title">مديرية التربية لولاية</label>
                  <input type="text" name="directorate" value={formData.directorate} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الرتبة المطلوبة (ابتدائي/متوسط/ثانوي)</label>
                  <input type="text" name="requestedRank" value={formData.requestedRank} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-title">مادة التدريس (بالنسبة للأساتذة)</label>
                  <input type="text" name="teachingSubject" placeholder="لغة عربية / رياضيات / ..." value={formData.teachingSubject} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-header">2. المعلومات الشخصية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-title">رقم التعريف الوطني (NIN) - يتكون من 18 رقم</label>
                  <input type="text" name="nin" maxLength={18} value={formData.nin} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">اللقب (بالعربية)</label>
                  <input type="text" name="lastNameAr" value={formData.lastNameAr} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الاسم (بالعربية)</label>
                  <input type="text" name="firstNameAr" value={formData.firstNameAr} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">اللقب (باللاتينية)</label>
                  <input type="text" name="lastNameLat" dir="ltr" className="text-left" value={formData.lastNameLat} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الاسم (باللاتينية)</label>
                  <input type="text" name="firstNameLat" dir="ltr" className="text-left" value={formData.firstNameLat} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">ابن (اسم الأب)</label>
                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">و (اسم الأم)</label>
                  <input type="text" name="motherFirstName" value={formData.motherFirstName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">لقب الأم</label>
                  <input type="text" name="motherLastName" value={formData.motherLastName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">تاريخ الميلاد</label>
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">مكان الميلاد</label>
                  <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الولاية</label>
                  <input type="text" name="birthState" value={formData.birthState} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">ولاية الازدياد</label>
                  <input type="text" name="birthOriginalState" value={formData.birthOriginalState} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الجنس</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="w-4 h-4" />
                      <span>ذكر</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="w-4 h-4" />
                      <span>أنثى</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="label-title">الحالة العائلية</label>
                  <input type="text" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">عدد الأولاد</label>
                  <input type="number" name="childrenCount" value={formData.childrenCount} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-title">العنوان الشخصي الكامل</label>
                  <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">بلدية الإقامة</label>
                  <input type="text" name="residenceCommune" value={formData.residenceCommune} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">رقم الهاتف</label>
                  <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            {formData.gender !== 'female' && (
              <div className="form-section">
                <h2 className="section-header">3. الوضعية تجاه الخدمة الوطنية</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-3 flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="militaryStatus" value="performed" checked={formData.militaryStatus === 'performed'} onChange={handleChange} />
                      <span>مؤدى</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="militaryStatus" value="exempted" checked={formData.militaryStatus === 'exempted'} onChange={handleChange} />
                      <span>معفى</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="militaryStatus" value="deferred" checked={formData.militaryStatus === 'deferred'} onChange={handleChange} />
                      <span>مؤجل</span>
                    </label>
                  </div>
                  <div>
                    <label className="label-title">رقم مرجع الوثيقة</label>
                    <input type="text" name="docRefNum" value={formData.docRefNum} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label-title">تاريخ إصدار الوثيقة</label>
                    <input type="date" name="docIssueDate" value={formData.docIssueDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label-title">تاريخ انتهاء الوثيقة</label>
                    <input type="date" name="docEndDate" value={formData.docEndDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label-title">تاريخ بداية الخدمة</label>
                    <input type="date" name="serviceStartDate" value={formData.serviceStartDate} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label-title">تاريخ نهاية الخدمة</label>
                    <input type="date" name="serviceEndDate" value={formData.serviceEndDate} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            <div className="form-section">
              <h2 className="section-header">4. الشهادة والمؤهل العلمي</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-title">تسمية الشهادة</label>
                  <input type="text" name="degreeName" placeholder="ليسانس / ماستر / ..." value={formData.degreeName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الشعبة / التخصص</label>
                  <input type="text" name="specialty" value={formData.specialty} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">رقم الشهادة</label>
                  <input type="text" name="degreeNum" value={formData.degreeNum} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">تاريخ التخرج (المداولات)</label>
                  <input type="date" name="graduationDate" value={formData.graduationDate} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-title">المؤسسة المسلمة</label>
                  <input type="text" name="issuingInstitution" value={formData.issuingInstitution} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">مدة التكوين (5 سنوات / # سنتين)</label>
                  <input type="text" name="trainingDuration" placeholder="أدخل 5 لـ 5 سنوات أو # لـ سنتين" value={formData.trainingDuration} onChange={handleChange} />
                  <p className="text-xs text-gray-500 mt-1 font-bold">5 = خمس سنوات | # = سنتين فقط</p>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="label-title">سنة البداية</label>
                    <input type="text" name="startYear" maxLength={4} value={formData.startYear} onChange={handleChange} />
                  </div>
                  <div className="flex-1">
                    <label className="label-title">سنة النهاية</label>
                    <input type="text" name="endYear" maxLength={4} value={formData.endYear} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label className="label-title">تقدير الشهادة</label>
                  <input type="text" name="degreeGrade" placeholder="مقبول / حسن / ..." value={formData.degreeGrade} onChange={handleChange} />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isEnsaGraduate" checked={formData.isEnsaGraduate} onChange={handleChange} />
                    <span className="font-bold">هل أنت خريج مدرسة وطنية عليا؟</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input type="checkbox" name="isFirstInClass" checked={formData.isFirstInClass} onChange={handleChange} />
                    <span className="font-bold">هل أنت الأول في الدفعة؟</span>
                  </label>
                </div>
              </div>

              {formData.isFirstInClass && (
                <div className="mt-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300">
                  <h3 className="font-black mb-3">خاص بالطالب الأول في الدفعة:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label-title">رقم الوثيقة</label>
                      <input type="text" name="firstInClassDocNum" value={formData.firstInClassDocNum} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">تاريخ الإصدار</label>
                      <input type="date" name="firstInClassDocDate" value={formData.firstInClassDocDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">الجهة المسلمة</label>
                      <input type="text" name="firstInClassIssuer" value={formData.firstInClassIssuer} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="form-section">
              <h2 className="section-header">5. تفاصيل المسار الدراسي (كشف النقاط)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="label-title">المعدل العام للمسار الدراسي</label>
                  <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">علامة مذكرة التخرج (إن وجدت)</label>
                  <input type="text" name="thesisGrade" value={formData.thesisGrade} onChange={handleChange} />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400 text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 font-bold">السنة الدراسية</th>
                      <th className="border border-gray-400 p-2 font-bold">معدل السداسي الأول</th>
                      <th className="border border-gray-400 p-2 font-bold">معدل السداسي الثاني</th>
                      <th className="border border-gray-400 p-2 font-bold">المعدل السنوي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((year, idx) => (
                      <tr key={year}>
                        <td className="border border-gray-400 p-2 font-bold bg-gray-50">السنة {year}</td>
                        <td className="border border-gray-400 p-2">
                          <input 
                            type="text" 
                            className="w-full border-none focus:ring-0 text-center" 
                            value={formData.semesters[idx].s1}
                            onChange={(e) => handleSemesterChange(idx, 's1', e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-400 p-2">
                          <input 
                            type="text" 
                            className="w-full border-none focus:ring-0 text-center" 
                            value={formData.semesters[idx].s2}
                            onChange={(e) => handleSemesterChange(idx, 's2', e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-400 p-2">
                          <input 
                            type="text" 
                            className="w-full border-none focus:ring-0 text-center" 
                            value={formData.semesters[idx].annual}
                            onChange={(e) => handleSemesterChange(idx, 'annual', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <div className="form-section">
              <h2 className="section-header">6. شهادات عليا أخرى (ماستر مكمل / دكتوراه)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-title">اسم الشهادة</label>
                  <input type="text" name="otherDegreeName" value={formData.otherDegreeName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الشعبة</label>
                  <input type="text" name="otherDegreeSpecialty" value={formData.otherDegreeSpecialty} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الجهة المسلمة</label>
                  <input type="text" name="otherDegreeIssuer" value={formData.otherDegreeIssuer} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">عدد السداسيات (من 1 - 6)</label>
                  <input type="text" name="otherDegreeSemesters" value={formData.otherDegreeSemesters} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">من السنة</label>
                  <input type="text" name="otherDegreeFromYear" maxLength={4} value={formData.otherDegreeFromYear} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">إلى السنة</label>
                  <input type="text" name="otherDegreeToYear" maxLength={4} value={formData.otherDegreeToYear} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-header">7. المنشورات والأعمال العلمية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-title">طبيعة العمل أو الدراسة</label>
                  <input type="text" name="publicationType" placeholder="مقال / ملتقى وطني ..." value={formData.publicationType} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">تاريخ الدراسة / النشر</label>
                  <input type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label-title">المجلة / الدورية</label>
                  <input type="text" name="journalName" value={formData.journalName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">عدد المجلة</label>
                  <input type="text" name="journalIssue" value={formData.journalIssue} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">رابط النشر</label>
                  <input type="text" name="publicationLink" value={formData.publicationLink} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-header">8. الخبرة المهنية (في قطاع التعليم)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="label-title">نوع الخبرة (يُحدّد تلقائيًا من الملحق)</label>
                  <input 
                    type="text" 
                    name="expType" 
                    readOnly 
                    className="bg-gray-100 font-bold"
                    placeholder="سيتم تعبئة هذا الحقل عند اختيار نوع الخبرة في المرحلة 5" 
                    value={formData.expType} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="label-title">الوظيفة / المنصب</label>
                  <input type="text" name="expJob" value={formData.expJob} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">تسمية الإدارة / المؤسسة</label>
                  <input type="text" name="expInstitution" value={formData.expInstitution} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">الشهادة المعتمدة</label>
                  <input type="text" name="expApprovedDegree" value={formData.expApprovedDegree} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">رقم شهادة عقد العمل</label>
                  <input type="text" name="expContractNum" value={formData.expContractNum} onChange={handleChange} />
                </div>
                <div>
                  <label className="label-title">تاريخ شهادة عقد العمل</label>
                  <input type="date" name="expContractDate" value={formData.expContractDate} onChange={handleChange} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="label-title">من</label>
                    <input type="date" name="expFrom" value={formData.expFrom} onChange={handleChange} />
                  </div>
                  <div className="flex-1">
                    <label className="label-title">إلى</label>
                    <input type="date" name="expTo" value={formData.expTo} onChange={handleChange} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="label-title">سبب إنهاء علاقة العمل</label>
                  <input type="text" name="expEndReason" value={formData.expEndReason} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <div className="form-section">
              <h2 className="section-header">9. الحالة المهنية (الوظيفة الحالية)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input type="checkbox" name="isEmployed" checked={formData.isEmployed} onChange={handleChange} />
                    <span className="font-bold">هل تشغل وظيفة حاليًا؟</span>
                  </label>
                </div>
                {formData.isEmployed && (
                  <>
                    <div className="md:col-span-2">
                      <label className="label-title">الرتبة المشغولة</label>
                      <input type="text" name="currentRank" value={formData.currentRank} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">تاريخ أول تعيين</label>
                      <input type="date" name="firstAppointmentDate" value={formData.firstAppointmentDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">تاريخ التعيين في الرتبة الحالية</label>
                      <input type="date" name="rankAppointmentDate" value={formData.rankAppointmentDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">الصنف / الدرجة</label>
                      <input type="text" name="currentGrade" value={formData.currentGrade} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2 mt-4">
                      <h3 className="font-black border-b border-gray-200 mb-2 pb-1">معلومات الإدارة المستخدمة:</h3>
                    </div>
                    <div>
                      <label className="label-title">رقم المرجع</label>
                      <input type="text" name="adminRefNum" value={formData.adminRefNum} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">تاريخ المرجع</label>
                      <input type="date" name="adminRefDate" value={formData.adminRefDate} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">صفة السلطة صاحبة الإمضاء</label>
                      <input type="text" name="signingAuthority" value={formData.signingAuthority} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="label-title">رقم هاتف الإدارة</label>
                      <input type="text" name="adminPhone" value={formData.adminPhone} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label-title">عنوان الإدارة</label>
                      <input type="text" name="adminAddress" value={formData.adminAddress} onChange={handleChange} />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-header">10. معلومات الاتصال</h2>
              <div>
                <label className="label-title">البريد الإلكتروني</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-header">11. الوثائق المرفقة (الملف الرقمي)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  "بطاقة الإقامة", "وثيقة الخدمة الوطنية",
                  "شهادة المؤهل العلمي (ديبلوم)", "كشوف نقاط المسار الدراسي",
                  "التكوين المكمل للشهادة (إن وجد)", "ملف الأشغال والدراسات المنجزة (مقالات)",
                  "وثيقة تثبت الوظيفة الحالية (إن وجدت)"
                ].map(doc => (
                  <label key={doc} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.attachedDocs.includes(doc)} onChange={() => handleDocToggle(doc)} />
                    <span className="text-sm font-bold">{doc}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-black mb-3 text-sm">ملف الخبرة المهنية (اختيار أحد الخيارات سيقوم بتعبئة حقل "نوع الخبرة" في المرحلة السابقة):</h3>
              <div className="space-y-2">
                {experienceOptions.map((exp, idx) => (
                   <label key={idx} className={`flex items-start gap-2 p-2 rounded border cursor-pointer hover:bg-gray-100 transition ${formData.expType === exp ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-gray-50 border-gray-200'}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1" 
                      checked={formData.attachedDocs.includes(exp)} 
                      onChange={() => handleDocToggle(exp)} 
                    />
                    <span className={`text-xs font-bold leading-relaxed ${formData.expType === exp ? 'text-blue-800' : ''}`}>{exp}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center py-6">
          {step > 1 && (
            <button 
              type="button" 
              onClick={prevStep}
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-black hover:bg-gray-300 transition"
            >
              السابق
            </button>
          )}
          {step < 5 ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="mr-auto bg-gray-800 text-white px-8 py-3 rounded-lg font-black hover:bg-gray-700 transition"
            >
              التالي
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mr-auto px-10 py-3 rounded-lg font-black transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الاستمارة'}
            </button>
          )}
        </div>
      </form>

      <footer className="mt-10 border-t pt-6 text-center text-gray-500 text-xs font-bold">
        <p>د. عبد المجيد - استمارة معلومات إلكترونية</p>
        <p className="mt-1">جميع الحقوق محفوظة © 2024</p>
      </footer>
    </div>
  );
};

export default App;
