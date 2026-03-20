import shell from '@/page/announcement/shell.module.less'

interface Props {
  subtitle: string
  title?: string
}

const PageBrand: React.FC<Props> = ({ subtitle, title = 'Texas Poker' }) => {
  return (
    <>
      <div className={shell.brand}>{title}</div>
      <p className={shell.sub}>{subtitle}</p>
    </>
  )
}

export default PageBrand
