Live Link: https://newspaper-website-a12.web.app
Server Code: https://github.com/mahmud-me09/newspaper-website-server.git
Server Running on: https://newspaper-website-server.vercel.app

Name of Website: The Morning Tribune
Admin: john.doe@admin.com
Admin Password: asdfGh

Feature of the Website:
1. Admin Previledge is incorporated with attractive dashboard.
2. Admin can add or remove publisher.
3. Users can register in the website for submitting articles as author.
4. Admin can view the submitted articles and if deem suited will flag it for publishing as premium or non-premium article.
5. Normal user can take subscription to become a premium user by paying for a certain subscription period.
6. Stripe Payment system added.
7. article views is counted and most trending articles are shown in the homepage. 
8. Article views vs publisher is displayed in the admin dashboard.
9. Non premium user are allowed for publishing only one article while premium users can publish unlimited articles.
10. Admin can make any user admin through his dashboard UI.


Steps to run this project locally:
1. clone this project
2. create an .env file:

VITE_authDomain=your firebase auth domain
VITE_projectId= your firebase project ID
VITE_storageBucket=your firebase storage bucket
VITE_messagingSenderId=your firebase messaging sender ID
VITE_appId=your firebase app id
VITE_imgbb_API=imgbb_API
VITE_Publishable_Key=Publishable key for imgbb

3. configure tailwind and daisyui in your project
4. run "npm install"