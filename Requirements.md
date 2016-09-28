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

 3.1. Only *html text* and *images* are in the *scope* of annotation selecting. Any text in the *selected region* will become *annotation body*. Selecting partial image or any other online content like *pdf*,*video*..etc are out of the scope.

 3.2. It is assumed that no web resource is going to change. So annotation versioning is **not** required.
 
4. Annotation JSON Object

 4.1. All Annotation JSON objects must be valid and readable by any system following the standarts, determined in [w3 Documentation](https://www.w3.org/TR/annotation-model/)

5. Annotation Management

 5.1. In order to avoid abusing annotations, an *admin* user will have necessary privileges to *remove* and *edit* an annotation. If need be, *admin* user can *remove* all annotations from specific user and ultimately *ban* user from creating further web annotations.
 
 5.2. Annotations can be stored in any database in any format. However, back-end should always follow standarts specified in [w3 Documentation](https://www.w3.org/TR/annotation-model/) when serving them.
 
 5.3 Annotation character limit is not yet specified. Follow [this issue](https://github.com/bogaziciswe/b.w.a.t/issues/10) for further clarifications.
 
6. User UI Control

 6.1. User should be able to *disable* seeing annotations.
 
 6.2. UI should allow user to see multiple annotations on the same content, ie coinciding annotations in the given text should not block each other and should look clear enough to enable user to understand that there are more than one annotations referring the same content. There is no specification about *how to show* annotations on the UI. It is entirely up to us to decide.
 
 6.3. If user *enabled* annotations on the page, actual content of the annotations should **not** be automatically visible. User should *interact* with UI to see it's content. There is no specification about how this interaction should be. It could be a mouse hover, a button click a hot-key combination or something else. It is up to us to decide.

