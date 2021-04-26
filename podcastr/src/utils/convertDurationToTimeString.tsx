export function convertDurationToTimeString(duration: number) {
  //converter os segundos para horas
  const hours = Math.floor(duration / 3600); // Math.floor arredonda para baixo
  const minutes = Math.floor((duration % 3600) / 60); //quantos minutos sobraram das horas
  const seconds = duration % 60;

  const timeString = [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0')) //garante que cada parte terá 2 digitos
    .join(':')
    
  return timeString;
}