# DiscoverPet
A web application to view adoptable pets in and around your area.<br>This website uses the free public API from [petfinder.com](https://www.petfinder.com/developers/v2/docs/).<br>All illustrations are provided for free from [DrawKit](https://www.drawkit.com/product/animal-pets-illustrations)

<p align="center">
  <img src="https://user-images.githubusercontent.com/81598612/236098274-6ed80b9b-b2cb-4d03-a8a2-3a25119ab8a9.png" width=80% >
</p>

## Getting Started
1. Make a PetFinder API account and take note of your API key and API secret key.
2. Make an .env file and paste the following code: 
- PETFINDER_API_KEY= {your API key here}
- PETFINDER_API_SECRET_KEY= {your API secret here}
- SESSION_SECRET= {any string here}
- MONGO_URL=<br>
*For security reasons the MONGO_URL will not be shared. The website will still function but users will not be able to create an account, log into an account, and add to their favorites list.*
4. Run “npm i” and “npm start”
5. Enter “localhost:3000” into browser URL

## Functionalities
- Pets are able to filtered by the following:

<p align="center">
  <img src="https://user-images.githubusercontent.com/81598612/236099143-36bd7e2a-a9af-489f-ad5c-0954c2a36aee.png" width=60% >
</p>

- In depth pet information is available to view when clicked on

<p align="center">
  <img src="https://user-images.githubusercontent.com/81598612/236102011-86873b08-7f14-4ebb-a5df-4c545f1096bd.png" width=40% >
</p>

- Shelters are available based on location and/or organization name

<p align="center">
  <img src="https://user-images.githubusercontent.com/81598612/236102317-be34266f-d19b-4777-a162-58f5af1b35bb.png" width=50% >
</p>

- Users are able to create accounts to store their favorite pets. This feature is only available to users logged into an account.
<p align="center">
  <img src="https://user-images.githubusercontent.com/81598612/236102951-2a6fee6d-8f1f-4106-ab7e-b8a4432ed403.png" width=50% >
</p>
