const fs = require('fs');

const code = fs.readFileSync('src/pages/EditorPage.tsx', 'utf8');

const sText = '<div className="max-w-4xl mx-auto pb-[120px] sm:pb-32">';
const startIndex = code.indexOf(sText);
const eText = '{/* Mobile Scroll to Top */}';
const endIndex = code.indexOf(eText);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find start or end index");
    process.exit(1);
}

const formContent = code.substring(startIndex, endIndex);

const part1 = code.substring(0, code.indexOf('<EditorNavbar'));
const part2 = code.substring(code.indexOf('      {/* Modals */}'));

let replacedMiddle = code.substring(code.indexOf('<EditorNavbar'), code.indexOf('      {/* Modals */}'));

// Eliminate formContent from replacedMiddle
replacedMiddle = replacedMiddle.replace(formContent, '{formContent}');

const newMiddle = `
  const formContent = (
    <div className="max-w-4xl mx-auto pb-[120px] sm:pb-32">
      ${formContent.replace('<div className="max-w-4xl mx-auto pb-[120px] sm:pb-32">', '')}
  );

  return (
    <div
      className={cn(
        "flex flex-col h-[100dvh] bg-neutral-50 overflow-hidden transition-colors duration-200",
        language === "ar" ? "font-editor-ar" : "font-editor-en",
      )}
      dir={dir}
    >
      <Helmet>
        <title>{language === "ar" ? "محرر السيرة الذاتية" : "Resume Editor"} | Hash Resume</title>
        <meta
          name="description"
          content="Build your professional resume with our AI-powered editor."
        />
      </Helmet>
      <OnboardingTour />

      {isMobile ? (
        <MobileEditorLayout
          lang={language as "ar" | "en" | "fr"}
          atsScore={atsScore}
          activeSection={activeTab}
          onSectionChange={(id: string) => setActiveTab(id as any)}
          completionMap={sidebarCompletionMap}
          onExportPDF={handleExportClick}
          onExportWord={async () => {
            try {
              await generateWord(data);
            } catch (e) {
              console.error("Export word failed", e);
            }
          }}
          previewContent={
            <div className="bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] rounded-[0.5rem] overflow-hidden mx-auto w-full relative h-[calc(100vh-140px)]" style={{ minHeight: "297mm", transform: 'scale(0.55)', transformOrigin: 'top center' }}>
              <Suspense fallback={<FormLoader />}>
                {previewMode === "cover-letter" ? <CoverLetterPreview /> : <ResumePreview ref={componentRef} />}
              </Suspense>
            </div>
          }
        >
          <main ref={formRef} onScroll={handleFormScroll} className="w-full h-full relative">
            {formContent}
          </main>
        </MobileEditorLayout>
      ) : (
        <>
          ${replacedMiddle.replace(/return \([\s\S]*?<OnboardingTour \/>/, '')}
        </>
      )}
`;

fs.writeFileSync('src/pages/EditorPage.tsx', part1 + newMiddle + '\n      {/* Modals */}' + part2.substring('      {/* Modals */}'.length));
console.log("Done");
