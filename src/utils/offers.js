export const OPERATORS = [
 {id:'grameenphone',logo:'/logos/grameenphone.svg',name:'Grameenphone',short:'GP',color:'#00A1E0'},
 {id:'robi',logo:'/logos/robi.webp',name:'Robi',short:'Robi',color:'#E4002B'},
 {id:'banglalink',logo:'/logos/banglalink.webp',name:'Banglalink',short:'BL',color:'#F58220'},
 {id:'airtel',logo:'/logos/airtel.webp',name:'Airtel',short:'Airtel',color:'#D9262C'},
 {id:'teletalk',logo:'/logos/teletalk.webp',name:'Teletalk',short:'TT',color:'#3BA935'}]
export const CATEGORIES = ['internet','minute','combo','drive','sms','special','discount','latest','popular']
export const opById = id => OPERATORS.find(o => o.id === id)
export const todayDhaka = () => new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Dhaka'})
export const calcDiscount = (reg, off) => {
  const r = Number(reg), o = Number(off)
  if (!isFinite(r) || !isFinite(o) || r <= 0 || o < 0 || o > r) return 0
  return Math.round(((r - o) / r) * 100)
}
export const effectiveStatus = o => {
  if (o.status === 'inactive') return 'inactive'
  if (o.expiryDate && o.expiryDate < todayDhaka()) return 'expired'
  return 'active'
}
