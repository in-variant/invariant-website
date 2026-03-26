export default function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-6 md:px-12 lg:px-24 xl:px-32">
      <div className="section-rule" />
      <p className="section-label mt-6 mb-2">{label}</p>
    </div>
  )
}
