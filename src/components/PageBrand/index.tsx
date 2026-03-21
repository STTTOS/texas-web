import shell from '@/page/announcement/shell.module.less'
import { BRAND_EN } from '@/constants/brand'

interface Props {
  subtitle: string
  title?: string
}

const PageBrand: React.FC<Props> = ({ subtitle, title = BRAND_EN }) => {
  return (
    <>
      <div className={shell.brand}>{title}</div>
      <p className={shell.sub}>{subtitle}</p>
    </>
  )
}

export default PageBrand
