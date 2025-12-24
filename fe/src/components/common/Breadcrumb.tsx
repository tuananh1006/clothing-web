import { Link } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-400" aria-label="Breadcrumb">
      <Link
        to={ROUTES.HOME}
        className="hover:text-primary transition-colors"
        aria-label="Home"
      >
        <span className="material-symbols-outlined text-base">home</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">chevron_right</span>
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-main dark:text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb

