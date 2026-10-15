import { Schema, model, models, type Model } from 'mongoose'
import { GUESTBOOK_LIMITS } from '@/lib/types'

/* 방명록 글 (컬렉션: guestbookentries) */

type GuestbookDoc = {
  name: string
  message: string
  createdAt: Date
  updatedAt: Date
}

const guestbookSchema = new Schema(
  {
    // 서버에서 한 번 검사하지만, DB 스키마에서도 길이를 한 번 더 제한
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: GUESTBOOK_LIMITS.name,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: GUESTBOOK_LIMITS.message,
    },
  },
  { timestamps: true },
)

export const GuestbookEntry = (models.GuestbookEntry ||
  model('GuestbookEntry', guestbookSchema)) as unknown as Model<GuestbookDoc>
