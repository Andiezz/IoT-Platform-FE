import moment from 'moment';

export function normalizeInputBlockCharacter(value: string) {
  return value.replace(/\D/, '');
}

export function normalizeFormatDate(value?: string) {
  return moment(value).format('MMMM DD, YYYY, HH:mm:ss');
}
export function normalizeTrimStart(value: string){
  return value.trimStart()
}
