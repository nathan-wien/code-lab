## Security Mechanisms

* A newly created bucket can only be accessed by:
  * the user who created it
  * the account owner
* To grant access to other users, use one or a combination of the following access management features:
  * **AWS Identity and Access Management (IAM)**: is used to create users and manage their respective access to resources, including buckets and objects.
  * **Bucket policies**: are used to configure permissions for all or a subset of objects using tags and prefixes.
  * **Pre-Signed URLs**: are used to grant time-limited access to others with temporary URLs.
  * **Access control lists**: make individual objects accessible to authorized users. Note that this access control mechanism predates IAM and not recommended (should use bucket policies or IAM policies instead).
