import React from 'react'

const profile = () => {
    return (
        <div>
         <div style={{display:"flex",
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
              <img style={{width:'160px', height:'160px',borderRadius:"80px"}}
              src="https://images.unsplash.com/photo-1554126807-6b10f6f6692a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
              />
          </div>
          <div>
              <h4>ramesh verma</h4>
              <div style={{display:"flex"}}>
                <h5>40 posts</h5>
                <h5>40 posts</h5>
                <h5>40 posts</h5>
              </div>
          </div>
        </div>
    )
}

export default profile
