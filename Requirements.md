# PROJECT REQUIREMENTS

1. User Authentication
 1.1. Specification of user auth. method is not clear. We have [an issue](https://github.com/bogaziciswe/b.w.a.t/issues/9) to keep track of that.

 1.2. User is **required** to authenticate in order to annotate.

2. Authenticated User Annotations

 2.1. Authenticated user can annotate content **publicly** or **privately**.

 2.2. **Public Annotations** can be seen by anyone.

 2.3. **Private Annotations** can only be seen by user itself.

 2.4. Creating a group of users and allowing them to read each-other's annotations is an *optional* requirement.

3. Content Scope
 ..* Only *html text* and *images* are in the *scope* of annotation selecting. Any text in the *selected region* will become *annotation body*. Selecting partial image or any other online content like *pdf*,*video*..etc are out of the scope.
