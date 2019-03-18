import React from 'react';

class Pagination extends React.Component {
    render() {
        const {
            page,
            lastPage,
            pageClick,
        } = this.props

        let pageNumbers = []
        let pageTmps = []
        for (let i = 1; i <= lastPage; i++) {
            if (i == 1 || i == 2 || i == lastPage - 1 || i == lastPage) {
                pageTmps.push(i)
            } else if ((i - page) >= -2 && (i - page) <= 2) {
                pageTmps.push(i)
            } else if (page <= 3 && i <= 5) {
                pageTmps.push(i)
            } else if (page >= lastPage - 2 && i >= lastPage - 4) {
                pageTmps.push(i)
            }
        }
        for (let i = 0; i < pageTmps.length; i++) {
            pageNumbers.push(pageTmps[i])
            if (i < (pageTmps.length - 1) && pageTmps[i] != (pageTmps[i + 1] - 1)) {
                pageNumbers.push(-1)
            }
        }
        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-end">
                    {
                        pageNumbers.map((pageIndex) => {
                            return pageIndex == page ? (
                                <li className="page-item active">
                                    <span class="page-link">
                                        {pageIndex}
                                        <span className="sr-only">(current)</span>
                                    </span>
                                </li>
                            ) : (
                                    pageIndex == -1 ? (
                                        <li className="page-item"><a class="page-link">...</a></li>
                                    ) : (
                                            <li className="page-item"><a class="page-link" onClick={() => { return pageClick(pageIndex) }}>{pageIndex}</a></li>
                                        )
                                )
                        }
                        )
                    }
                </ul>
            </nav>
        )
    }
}

export default Pagination;
