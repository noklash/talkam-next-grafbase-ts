import NextAuth, { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt';
import jsonwebtoken from "jsonwebtoken";
import GitHubProvider from 'next-auth/providers/github';


export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
      ],
//    To finish configuring NextAuth.js with Grafbase we will need to update the JWT
//     generated to include the iss claim that matches the issuer value in
//      the grafbase/schema.graphql config.
jwt: {
    encode: ({ secret, token }) =>
      jsonwebtoken.sign(
        {
          ...token,
          iss: 'nextauth',
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60
        },
        secret
      ),
    decode: async ({ secret, token }) =>
      jsonwebtoken.verify(token!, secret) as JWT
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.username = profile?.name
      }
      return token
    },
    session({ session, token }) {
      if (token.username) {
        // const sessionInfo = session?.user?.name
        // if (session.user !== undefined){
          session.user = token?.username
        // }
        
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
