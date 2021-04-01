# Proof of Concept - Nacelle x Next.js Storefront w/Shopify AJAX Cart

This example site is a proof-of-concept which demonstrates the use of a server-side Shopify Cart (via the <a href="https://shopify.dev/docs/themes/ajax-api/reference/cart" target="_blank" rel="noopener">AJAX API</a>) in a Nacelle-powered static (SSG) Next.js storefront.

## Quick Start

1. Create a `.env.local` using the environment variables shown in `.env.example`
2. `npm i` to install dependencies
3. `npm run dev` to spin up the development server
4. Visit `http://localhost:3000`
5. Add to Cart / Remove from Cart to interact with the Shopify cart

## Motivation

Shopify Plus merchants use <a href="https://help.shopify.com/en/manual/checkout-settings/script-editor" target="_blank" rel="noopener">Shopify Scripts</a> to apply discounting rules ("Free shipping when you spend $50 or more," bundling, etc.) to the Shopify cart and checkout.

Because headless Shopify storefronts use a <a href="https://shopify.dev/docs/storefront-api/reference/checkouts/checkoutcreateinput" target="_blank" rel="noopener">simple object</a> to initialize a checkout with the Shopify Storefront API, headless Shopify storefronts don't use the Shopify cart. Rather, it is up to the developer to create a cart and pass its contents to the Shopify Storefront API's <a href="https://shopify.dev/docs/storefront-api/reference/checkouts/checkoutcreate" target="_blank" rel="noopener">`checkoutCreate`</a> GraphQL mutation.

This means that the headless cart is unable to leverage Shopify Scripts. And for the foreseeable future, Shopify won't provide an API endpoint that allows developers to access In order for discounts to appear in the cart and match the discounts available at checkout, the developer must replicate the Shopify Scripts logic (written in Ruby) in their JavaScript-powered frontend framework, or in a serverless function used by the headless cart.

While this approach is tolerable to some merchants and their developers, merchants with a lot of Shopify Scripts logic are reluctant to rewrite and maintain this logic somewhere else. Duplicate discount logic written in another programming language can be difficult to test and trust, and errors + unhandled edge cases can manifest as customer-facing discrepencies between the cart total and the checkout total.

With this in mind, the motivation to explore using Shopify's server-side cart in a headless storefront becomes clear: if it works, it would allow merchants to leverage Shopify Scripts in both their headless site's cart, and on the Shopify-hosted checkout.

## Findings

With some code gymnastics with serverless functions and cookies, it is possible to use the Shopify server-side cart in a headless storefront:

<video width="560" height="240" controls>
  <source src="https://user-images.githubusercontent.com/5732000/113243585-4e7a3380-9281-11eb-88fc-355adef89f2d.mov">
  https://user-images.githubusercontent.com/5732000/113243585-4e7a3380-9281-11eb-88fc-355adef89f2d.mov
</video>

### Intentional Limitations

Note that the <a href="https://poc-nacelle-nextjs-shopify-cart.vercel.app/" target="_blank" rel="noopener">demo site</a> only has two (visible) cart functions that the user can interact with: Add to Cart, and Remove from Cart. This approach is entirely compatible with other traditional cart functions (e.g. updating quantity) - they simply weren't deemed necessary for this POC project.

### Performance

The above video shows that there is some slight latency associated with adding to cart + removing from cart. To deal with this, you could maintain a separate cart object which would be used as the source of truth for the UI. Changes to the cart would then need to be treated as optimistic transactions in which the UI-driving cart object and the Shopify cart are updated asynchronously.

#### Maintaining two carts

Optimistic & asynchronous cart transactions introduces a new set of challenges - how do you deal with situations in which the Shopify server-side cart becomes out-of-sync with the UI-driving cart object, which doesn't depend on successful network requests? This could become problematic for a customer who is shopping on their mobile phone during a train commute with a spotty network connection.

In the event of a desync between the two carts, interval-driven polling of the Shopify AJAX API could be used to re-sync the carts. But building this system introduces complexity that needs to be accounted for when weighing the pros and cons of the headless storefront w/ Shopify AJAX Cart approach.

### Stability

Shopify does not recommend that their AJAX API be used outside of a Shopify Liquid storefront context. There is no implied warranty, and there certainly isn't any guarantee that the cookie gymnastics that power this demo today will work tomorrow. Shopify could make changes to the AJAX API that would render this POC demo unusable, while maintaining backwards-compatibility for Shopify Liquid storefronts.

For these reasons, the approaches used to achieve this POC are not supported, recommended, or endorsed by Nacelle. Please keep this in mind if borrowing any of the patterns used in this repo for your own purposes.
