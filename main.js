const mongoose = require('mongoose')
const databaseUrl = 'mongodb://localhost/schwarz_orders'
mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection

const OrdersSchema = new mongoose.Schema({
  orderId: { type: Number },
  companyName: { type: String },
  customerAdress: { type: String },
  orderedItem: { type: String },
})
mongoose.set('useCreateIndex', true)
OrdersSchema.index({ orderId: 1 }, { unique: true })

const Orders = mongoose.model('Orders', OrdersSchema)

const dropDatabase = async () => {
  await mongoose.connection.db.dropDatabase()
}
const seed = async () => {
  const data = require('./fixtures.js')
  await Orders.create(data)
}

const countOrderedItemAndSort = async () =>
  Orders.aggregate([
    { $group: { _id: '$orderedItem', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        orderedItem: '$_id',
        count: 1,
      },
    },
  ])

mongoose.connection.on('open', async () => {
  await dropDatabase()
  await seed()

  //   1.show all orders from a particular company
  const companyName = 'MegaCorp'
  const ordersFromCompany = await Orders.find({ companyName: companyName })

  //   2.show all orders from a particular adress
  const adress = 'Reeperbahn 153'
  const ordersFromAdress = await Orders.find({ customerAdress: adress })

  //   3.delete a particular order given an orderId
  const id = null
  const deletedOrder = await Orders.findOneAndDelete({ orderId: id })

  //   4.display how often each item has been ordered, in descending order
  const countedAndSortedItems = await countOrderedItemAndSort()

  await mongoose.connection.close()
})

/*** 
Why did you pick your particular your design? What assumptions did you make, and what tradeoffs did you consider?

1. i chose to work with mongoose here, since it abstracts away a lot of the mongodb drivers functionallity

2. i decided to keep the execution of the script in a single file and a simple-to-follow sequence. 
This is based on the assumption, that this code is not used elsewhere.
working on a larger project, a split to different modules with different concerns would be of course more appropriate 
(separating setup, configuration, model and controlling)

3. All queries but the 4th one and the setup/teardown are executed inside the main function. 
This is, because aggregate queries can grow in length and would make the code hard to read

4. i chose to have rather long variable names, using camelCase. 
This is because most of the modern IDEs have autocomplete features when developing.
I prefer to keep variable declarations names (like databaseUrl) instead of inserting them straight into queries/calls. 
It makes the code more readable in my opinion. 

5. I removed all console.logs as it would be the case in any production system. 
however, i kept the comments (1-4) to indicate the single tasks which are being executed.


What is the complexity of your operations (O- notation)?

Since i didnt create an Index for any of the fields but the orderId, the O-notations are

1) O(n)
2) O(n)
3) O(log n)
4) O(n)

***/
