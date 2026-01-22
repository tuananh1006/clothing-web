import { useEffect, useState } from 'react'
import { parseAddress } from '@/utils/formatters'
import * as locationsService from '@/services/locations.service'

interface AddressDisplayProps {
  addressString: string | undefined | null
  className?: string
}

const AddressDisplay = ({ addressString, className = '' }: AddressDisplayProps) => {
  const [formattedAddress, setFormattedAddress] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const formatAddressWithNames = async () => {
      if (!addressString) {
        setFormattedAddress('')
        return
      }

      const parsed = parseAddress(addressString)
      if (!parsed) {
        // Nếu không parse được, hiển thị nguyên bản
        setFormattedAddress(addressString)
        return
      }

      setLoading(true)
      try {
        // Fetch tên của province, district, ward
        const [province, district, ward] = await Promise.all([
          locationsService.getProvinces().then(provinces => 
            provinces.find(p => p.id === parsed.province_id)
          ),
          parsed.district_id 
            ? locationsService.getDistricts(parsed.province_id).then(districts =>
                districts.find(d => d.id === parsed.district_id)
              )
            : Promise.resolve(null),
          parsed.ward_id && parsed.district_id
            ? locationsService.getWards(parsed.district_id).then(wards =>
                wards.find(w => w.id === parsed.ward_id)
              )
            : Promise.resolve(null),
        ])

        // Format địa chỉ đầy đủ
        const parts = [parsed.address]
        if (ward) parts.push(ward.name)
        if (district) parts.push(district.name)
        if (province) parts.push(province.name)

        setFormattedAddress(parts.join(', '))
      } catch (error) {
        console.error('Error fetching location names:', error)
        // Fallback: chỉ hiển thị phần địa chỉ cụ thể
        setFormattedAddress(parsed.address)
      } finally {
        setLoading(false)
      }
    }

    formatAddressWithNames()
  }, [addressString])

  if (loading) {
    return <span className={className}>Đang tải...</span>
  }

  return <span className={className}>{formattedAddress || addressString || ''}</span>
}

export default AddressDisplay

