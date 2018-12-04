import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { ResultCard } from "@appbaseio/reactivesearch";
import { withStyles } from "@material-ui/core/styles";
import track from "lib/tracking/track";
import trackProductClicked from "lib/tracking/trackProductClicked";
import PageSizeSelector from "components/PageSizeSelector";
import SortBySelector from "components/SortBySelector";

const styles = (theme) => ({
  filters: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing.unit * 2
  },
  resultCard: {
    "& .resultImage": {
      boxShadow: "none"
    }
  }
});

@withStyles(styles, { name: "SkProductGrid" })
@track()
export default class ProductGrid extends Component {
  static propTypes = {
    catalogItems: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    currencyCode: PropTypes.string.isRequired,
    initialSize: PropTypes.object,
    isLoadingCatalogItems: PropTypes.bool,
    pageInfo: PropTypes.shape({
      startCursor: PropTypes.string,
      endCursor: PropTypes.string,
      hasNextPage: PropTypes.bool,
      hasPreviousPage: PropTypes.bool,
      loadNextPage: PropTypes.func,
      loadPreviousPage: PropTypes.func
    }),
    pageSize: PropTypes.number.isRequired,
    setPageSize: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired
  };

  renderFilters() {
    const { classes, pageSize, setPageSize, setSortBy, sortBy } = this.props;

    return (
      <Grid container spacing={8} className={classes.filters}>
        <Grid item>
          <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
        </Grid>
        <Grid item>
          <SortBySelector sortBy={sortBy} onChange={setSortBy} />
        </Grid>
      </Grid>
    );
  }

  @trackProductClicked()
  onItemClick = (event, product) => {} // eslint-disable-line no-unused-vars

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <ResultCard
          className={classes.resultCard}
          componentId="catalogSearchResults"
          dataField="product.title"
          innerClass={{
            listItem: "resultImage"
          }}
          onData={(res) => ({
            description: res.product.vendor,
            image: `http://localhost:3000/${res.product.media[0].URLs.small}`,
            title: <div>{res.product.title}{res.product.pricing.USD.displayPrice}</div>,
            url: `/product/${res.product.slug}`
          })}
          pagination={true}
          react={{
            and: ["catalogSearchBox"]
          }}
          size={20}
          stream={true}
          target="_self"
        />
      </Fragment>
    );
  }
}
