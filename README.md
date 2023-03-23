# React-Native-TakeHome-Challenge
This project is my job entry exam for a React Native developer position. I used the Pokemon API to implement my React Native application. The application incorporates real-world data on different Pokemon species, and I have organized the code in a structured and understandable manner. 

You can download final expoted apk file from this link. https://drive.google.com/file/d/1AEyckkHvDk8FmM7xXy3WcmuqFsGDhi0X/view?usp=sharing


## Resources

- API: [Pokemon TCG](https://pokemontcg.io)
- Design (Mobile screen only):
  - prototype: <https://www.figma.com/proto/GEbDoXIEkMvK8UrJlcz7Z7/Pokemon-TCG-Marketplace?node-id=1%3A34&scaling=contain&page-id=0%3A1&starting-point-node-id=1%3A34&show-proto-sidebar=1>


# Project Description
  - JavaScript
  - ReactNative
  - React Query
  - React Native Navigation
  - React Hook

# Installation
## Getting Started
To start the project, follow these steps:

- Clone the repository to your local machine: `https://github.com/empiretylh/React-Native-TakeHome-Challenge.git`
- Install the project dependencies:
  `npm install`
- Start the development server:`npx react-native start`
- In a separate terminal window, launch the app on your preferred platform. For example, to launch the app on iOS, run:`npx react-native run-ios` To launch the app on Android, run:`npx react-native run-android`

That's it! You should now have the development server running and be able to launch the app on your preferred platform. 

# Usage
  - On the first login screen, Enter your username and password (whatever it is) and login.
  - You can filter the pokemon card by the name, types, rarity, and set name
  - You can select the pokemon card to add to cart. see total amount of the cart.
  
# Project images file
<img src="https://github.com/empiretylh/React-Native-TakeHome-Challenge/blob/master/card1.png" alt="Login & Home" width="400"/>
<img src="https://github.com/empiretylh/React-Native-TakeHome-Challenge/blob/master/card2.png" alt="Login & Home" width="400"/>


## Exam Requirements (95%)

- ✅ Able to export apk or ipa (if you are using expo please use bare workflow)
- ✅ Create Login screen (doesn't include in design so can use simple design screen)
  - ✅ Implementing Authentication flow (api doesn't require authentication but you can include authentication header for simple demonstration)
  - ✅ Using react native navigation to navigate login to home page
- ✅ Card list:
  - ✅ Implement search/filter (**optional**):
    - ✅ Name
    - ✅ Type
    - ✅ Rarity
    - ✅ Set
  - ✅ Loading/PageSize limit: `12` cards on each api call
  - ✅ Implement `Loadmore` style pagination
- ✅ Use card `price` data from `cardmarket.prices.*`
- ✅ Use card's stock from `set.total`
- ✅ Cart:
  - ✅ Display selected cards as per design
  - ✅ Quantity must be able to increase, decrease & remove. Must respect the stock left limit
  - ✅ Display total number of selected cards
  - ✅ Display total price of all the cards
  - ✅ All cards should be clearable at once from cart


## Bonus

The following are some strategies to leave us with a better impression. But remember, **they're not required**.

- ✅ UI should look like as figma for both android & ios
- ✅ Using [react native navigation](https://reactnavigation.org/) for pop up modal
- ✅ Using [react query](https://tanstack.com/query/latest/docs/react/overview)
- ✅ Using React hooks
- ❎ Using TypeScript (I used JavaScript)
- ✅ Meaningful git commit
- ✅ Well-structured and organized repository
