const CoverLetter = async ({ params }) => {
  const { id } = await params;   // 👈 important

 
  return <div>CoverLetter: {id}</div>;
};

export default CoverLetter;
