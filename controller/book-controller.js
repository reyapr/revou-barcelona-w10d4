
const getAllBooks = async (req, res) => {
  try {
    const books = await req.db.collection('books').find().toArray()
    
    res.status(200).json({
      message: 'Books successfully retrieved',
      data: books
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const createBooks = async (req, res) => {
  const { title, author } = req.body
  
  console.log(title, author, `<=================== books ==================`);
  
  try {
    const newBook = await req.db.collection('books').insertOne({ title, author })
    
    res.status(200).json({
      message: 'Book successfully created',
      data: newBook
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllBooks,
  createBooks
}