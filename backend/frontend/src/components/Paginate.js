import React, { useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = (pages, page, keyword = "", path) => {
  const searchKeyword = keyword;
  

  const searchParams = new URLSearchParams();
  searchParams.append("keyword", searchKeyword);

  return (
    pages.pages > 1 && (
      <Pagination>
        {[...Array(pages.pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={{
              pathname: path,
              search: `?${searchParams.toString()}&page=${x + 1}`,
            }}
          >
            <Pagination.Item
              key={x + 1}
              disabled={x + 1 == pages.page}
              className="px-2"
            >
              {x + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
// `/?keyword=${keyword}&page=${x+1}`
