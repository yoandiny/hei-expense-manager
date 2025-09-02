

const Signup = () => {
  return (
    <div>
      <h1>Inscription</h1>
      <form>
        <label htmlFor="name">Nom :</label>
        <input type="text" id="name" name="name" /><br />
        <label htmlFor="email">Email :</label>
        <input type="email" id="email" name="email" /><br />
        <input type="submit" value="S'inscrire" />
      </form>
    </div>
  )
}

export default Signup
