import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  let decodedToken = jwt.verify(req.query.secret, "sokomows", {
    complete: true,
  }).payload;

  console.log(decodedToken);

  if (!decodedToken) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await Promise.all(
      decodedToken.productsIds.map(
        async (id) => await res.revalidate(`/product/${id}`)
      )
    );
    await res.revalidate(`/`);

    return res.json({ revalidated: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error revalidating");
  }
}
