import { z } from "zod";
import { confrimEmail, updateBasicInfo, updateEmail, UpdatePassword } from './../../../module/user/user.validation';

export type updateInfoDto = z.infer<typeof updateBasicInfo>

export type updatePass = z.infer<typeof UpdatePassword>

export type UpdateEmailDto = z.infer<typeof updateEmail>

export type ConfirmEmailDto = z.infer<typeof confrimEmail>