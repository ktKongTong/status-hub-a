import {UserSchema} from "@/models/base/user";

export const CurrentUserVOSchema = UserSchema
.openapi("User",{
  example: {
    id: '123',
    name: 'John Doe',
    email: 'johndoe@ashallendesign.co.uk',
    emailVerified: new Date(),
    avatar: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk'
  }
})