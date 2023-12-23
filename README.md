This repo serves as a proof of concept to allow the scan of Digikeys package data matrix codes and inserting the metadata directly into PartDB.

These codes contain information about the part number and bag quantities. So it should make it easier to add or update components.

The app requires API access to PartDB. 


The dev server currently serves via HTTPS, as phone browsers simply reject camera functionality served from an HTTP url.

It serves a self signed certificate and installs it on your personal machine, so be aware to remove it later.

For building the app and deploying it somewhere, this is not required. 