import NextAuth, { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt';
import jsonwebtoken from "jsonwebtoken";
import GitHubProvider from 'next-auth/providers/github';

import { getServerSession } from "next-auth/next";
import { AdapterUser } from "next-auth/adapters";
// import { createUser, getUser } from "./actions";


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
        
        // if (session.user !== undefined){
          token.username = session.user?.name 
          // still trying 
          // console.log(session.user)
        // }
        
      }
      return session
    }
  }
}

export default NextAuth(authOptions)


// New here
// jwt: {
//   encode: ({ secret, token }) => {
//     const encodedToken = jsonwebtoken.sign(
//       {
//         ...token,
//         iss: "grafbase",
//         exp: Math.floor(Date.now() / 1000) + 60 * 60,
//       },
//       secret
//     );
    
//     return encodedToken;
//   },
//   decode: async ({ secret, token }) => {
//     const decodedToken = jsonwebtoken.verify(token!, secret);
//     return decodedToken as JWT;
//   },
// },
// theme: {
//   colorScheme: "light",
//   logo: "/logo.svg",
// },


// callbacks: {
//   async session({ session }) {
//     const email = session?.user?.email as string;

//     try { 
//       const data = await getUser(email) as { user?: UserProfile }

//       const newSession = {
//         ...session,
//         user: {
//           ...session.user,
//           ...data?.user,
//         },
//       };

//       return newSession;
//     } catch (error: any) {
//       console.error("Error retrieving user data: ", error.message);
//       return session;
//     }
//   },
//   async signIn({ user }: {
//     user: AdapterUser | User
//   }) {
//     try {
//       const userExists = await getUser(user?.email as string) as { user?: UserProfile }
      
//       if (!userExists.user) {
//         await createUser(user.name as string, user.email as string, user.image as string)
//       }

//       return true;
//     } catch (error: any) {
//       console.log("Error checking if user exists: ", error.message);
//       return false;
//     }
//   },
// },
// };

// export async function getCurrentUser() {
// const session = await getServerSession(authOptions) as SessionInterface;

// return session;
// }