import React, { useState } from "react";
import Template1Harvard from "./Template1Harvard";
import Template2Swiss from "./Template2Swiss";
import Template3Nordic from "./Template3Nordic";
import { sampleData } from "../../data/sampleResume";

const TemplatePreview: React.FC = () => {
    const [template, setTemplate] = useState<"harvard" | "swiss" | "nordic">("harvard");

    return (
        <div className="flex flex-col items-center p-8 gap-8">
            <div className="flex gap-4 p-2 bg-neutral-100 rounded-lg">
                <button type="button" onClick={() => setTemplate("harvard")} className={`px-4 py-2 ${template === 'harvard' ? 'bg-white shadow' : ''}`}>Harvard</button>
                <button type="button" onClick={() => setTemplate("swiss")} className={`px-4 py-2 ${template === 'swiss' ? 'bg-white shadow' : ''}`}>Swiss</button>
                <button type="button" onClick={() => setTemplate("nordic")} className={`px-4 py-2 ${template === 'nordic' ? 'bg-white shadow' : ''}`}>Nordic</button>
            </div>
            <div className="border shadow-lg">
                {template === "harvard" && <Template1Harvard data={sampleData} />}
                {template === "swiss" && <Template2Swiss data={sampleData} />}
                {template === "nordic" && <Template3Nordic data={sampleData} />}
            </div>
        </div>
    );
};

export default TemplatePreview;
