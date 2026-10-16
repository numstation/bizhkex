type LegalSection = {
  title: string;
  paragraphs?: string[];
  listItems?: string[];
};

export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="prose prose-gray max-w-none space-y-10 text-gray-600">
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
          {section.listItems && section.listItems.length > 0 && (
            <ul className="list-disc list-inside space-y-2 ml-2">
              {section.listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
