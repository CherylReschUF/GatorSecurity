function GamePage() {
    return (
      <div className="container">
          <div className="row">
              <div className="col-lg-6 mb-4"> 
              <section className="d-flex justify-content-center">
                  <div className="card">
                      <img src="./kvalifik-3TiNowmZluA-unsplash.jpg" className="card-img-top" alt="Edgy Blue Computer Monitor"/>
                      <div className="card-body">
                      <h5 className="card-title">
                          Traditional Games
                      </h5>
                      <p className="card-text">
                          This will take you to the traditional games page.
                          <br></br>
                          (Photo by <a href="https://unsplash.com/@kvalifik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kvalifik</a> on <a href="https://unsplash.com/photos/3TiNowmZluA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash)</a>
                      </p>
                      <a href="./gameTraditional" className="btn btn-primary">
                          Click Here
                      </a>
                      </div>
                  </div>
              </section>
              </div>
              <div className="col-lg-6 mb-4">
              <section className="d-flex justify-content-center">
                  <div className="card">
                      <img src="./pexels-pixabay-207580.jpg" className="card-img-top" alt="Bright Business Code"/>
                      <div className="card-body">
                      <h5 className="card-title">
                          Choose Your Own Adventure Games
                      </h5>
                      <p className="card-text">
                          This will take you to the choose your own adventure games page.
                          <br></br>
                          (Photo by <a href="https://www.pexels.com/@pixabay/">Pixabay</a> on <a href="https://www.pexels.com/photo/blur-bright-business-codes-207580/">Pexels)</a>
                      </p>
                      <a href="./gameAdventure" className="btn btn-primary">
                          Click Here
                      </a>
                      </div>
                  </div>
              </section>
              </div>
          </div>
      </div>   
    );
  }
  
  export default GamePage;