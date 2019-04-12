export const isUserOrAdmin = user => {
  return user.role == 'USER' || user.role == 'ADMIN'
}

export const isManagerOrAdmin = user => {
  return user.role == 'MANAGER' || user.role == 'ADMIN'
}
