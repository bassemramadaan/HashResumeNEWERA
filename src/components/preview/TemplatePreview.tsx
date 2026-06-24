import React, { useState } from "react";
import TemplateClassic from "./TemplateClassic";
import TemplateModern from "./TemplateModern";
import TemplateExecutive from "./TemplateExecutive";
import TemplateMinimal from "./TemplateMinimal";
import TemplateTimeline from "./TemplateTimeline";
import { sampleData } from "../../data/sampleResume";

const TemplatePreview: React.FC = () => {
    const [template, setTemplate] = useState<"classic" | "modern" | "executive" | "minimal" | "timeline">("classic");

    return (
        <div className="flex flex-col items-center p-8 gap-8">
            <div className="flex gap-2 p-2 bg-neutral-100 rounded-lg overflow-x-auto">
                <button type="button" onClick={() => setTemplate("classic")} className={`px-4 py-2 rounded ${template === 'classic' ? 'bg-white shadow' : ''}`}>Classic</button>
                <button type="button" onClick={() => setTemplate("modern")} className={`px-4 py-2 rounded ${template === 'modern' ? 'bg-white shadow' : ''}`}>Modern</button>
                <button type="button" onClick={() => setTemplate("executive")} className={`px-4 py-2 rounded ${template === 'executive' ? 'bg-white shadow' : ''}`}>Executive</button>
                <button type="button" onClick={() => setTemplate("minimal")} className={`px-4 py-2 rounded ${template === 'minimal' ? 'bg-white shadow' : ''}`}>Minimal</button>
                <button type="button" onClick={() => setTemplate("timeline")} className={`px-4 py-2 rounded ${template === 'timeline' ? 'bg-white shadow' : ''}`}>Timeline</button>
            </div>
            <div className="border shadow-lg">
                {template === "classic" && <TemplateClassic data={sampleData} />}
                {template === "modern" && <TemplateModern data={sampleData} />}
                {template === "executive" && <TemplateExecutive data={sampleData} />}
                {template === "minimal" && <TemplateMinimal data={sampleData} />}
                {template === "timeline" && <TemplateTimeline data={sampleData} />}
            </div>
        </div>
    );
};

export default TemplatePreview;
