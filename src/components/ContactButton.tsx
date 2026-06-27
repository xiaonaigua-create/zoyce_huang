export default function ContactButton() {
  return (
    <button
      className="
        rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        font-medium uppercase tracking-widest text-white
        border-[2px] border-white
        [-3px]
        shadow-[0px_4px_4px_rgba(181,1,167,0.25),inset_4px_4px_12px_#7721B1]
        cursor-pointer
      "
      style={{
        background: 'linear-gradient(123deg, #18001F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
      }}
    >
      Contact Me
    </button>
  )
}
