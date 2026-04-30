import { codeToHtml } from 'shiki'
import { CopyButton } from '@/components/copy-button'

interface CodeBlockProps {
  code: string
  lang?: string
}

export async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })

  return (
    <div className="relative group rounded-lg overflow-hidden border">
      <CopyButton code={code} />
      <div
        className="text-sm overflow-x-auto [&>pre]:p-5 [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
