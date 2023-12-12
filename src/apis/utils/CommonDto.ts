import { ref } from "vue"
import type { Ref } from "vue"

export interface Gender {
  name: string
  value: string
}

export const genders: Ref<Gender[]> = ref<Gender[]>([
  { name: "남성", value: "MALE" },
  { name: "여성", value: "FEMALE" },
  { name: "공용", value: "COMMON" }
])
